<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="new-qweet"
            v-model="newQweetContent"
            label="What's Happening?"
            maxlength="280"
            bottom-slots
            autogrow
            counter
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            class="q-mb-lg"
            :disable="!newQweetContent"
            unelevated
            rounded
            no-caps
            color="primary"
            label="Qweet"
          />
        </div>
      </div>

      <q-separator class="divider" size="10px" color="grey-2" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="qweet in qweets" :key="qweet.id" class="qweet q-py-md">
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Natty Fernandez</strong>
                <span class="text-grey-7">
                  @natt_fernandez
                  <br class="lt-md" />&bull; {{ qweet.date | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="qweet-content text-body1">{{
                qweet.content
              }}</q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  @click="toggleLiked(qweet)"
                  flat
                  round
                  :color="qweet.liked ? 'pink' : 'grey'"
                  size="sm"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                />
                <q-btn
                  @click="deleteQweet(qweet)"
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from 'src/boot/firebase'
import { formatDistance } from 'date-fns'

export default {
  name: 'PageHome',
  data () {
    return {
      newQweetContent: '',
      qweets: [
        // {
        //   id: 'ID1',
        //   content:
        //     'Society cares for the individual only so far as he is profitable. ~Beauvoir',
        //   date: 1615692725777,
        //   liked: false
        // },
        // {
        //   id: 'ID2',
        //   content: 'One is not born a woman, but becomes one. ~Beauvoir',
        //   date: 1615692763011,
        //   liked: true
        // }
      ]
    }
  },
  methods: {
    addNewQweet () {
      const newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false
      }
      // this.qweets.unshift(newQweet)
      db.collection('qweets')
        .add(newQweet)
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id)
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        })
      this.newQweetContent = ''
    },

    deleteQweet (qweet) {
      db.collection('qweets')
        .doc(qweet.id)
        .delete()
        .then(() => {
          console.log('Document successfully deleted!')
        })
        .catch(error => {
          console.error('Error removing document: ', error)
        })
    },
    toggleLiked (qweet) {
      db.collection('qweets')
        .doc(qweet.id)
        .update({
          liked: !qweet.liked
        })
        .then(() => {
          console.log('Document successfully updated!')
        })
        .catch(error => {
          console.error('Error updating document: ', error)
        })
    }
  },
  filters: {
    relativeDate (value) {
      return formatDistance(value, new Date())
    }
  },
  mounted () {
    db.collection('qweets')
      .orderBy('date')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          const qweetChange = change.doc.data()
          qweetChange.id = change.doc.id
          if (change.type === 'added') {
            console.log('New qweet: ', qweetChange)
            this.qweets.unshift(qweetChange)
          }
          if (change.type === 'modified') {
            console.log('Modified qweet: ', qweetChange)
            const index = this.qweets.findIndex(
              qweet => qweet.id === qweetChange.id
            )
            Object.assign(this.qweets[index], qweetChange)
          }
          if (change.type === 'removed') {
            console.log('Removed qweet: ', qweetChange)
            const index = this.qweets.findIndex(
              qweet => qweet.id === qweetChange.id
            )
            this.qweets.splice(index, 1)
          }
        })
      })
  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
 border-top: 1px solid
 border-bottom: 1px solid
 border-color: $grey-4

.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)

.qweet-content
  white-space: pre-line

.qweet-icons
  margin-left: -5px
</style>
